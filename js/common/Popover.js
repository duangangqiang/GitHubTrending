import React, {PropTypes, Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Animated,
    View,
    Easing
} from 'react-native';

let {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
let DEFAULT_ARROW_SIZE = new Size(10, 5);

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Size(width, height) {
    this.width = width;
    this.height = height;
}

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

export default class Popover extends Component {
    static propTypes = {
        isVisible: PropTypes.bool,
        onClose: PropTypes.func,
        contentStyle: View.propTypes.style
    };

    static defaultProps = {
        isVisible: false,
        displayArea: new Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT),
        arrowSize: DEFAULT_ARROW_SIZE,
        placement: 'auto',
        onClose: () => {}
    };

    constructor(props) {
        super(props);
        this.state = {
            contentSize: {},
            anchorPoint: {},
            popoverOrigin: {},
            placement: 'auto',
            isTransitioning: false,
            defaultAnimatedValues: {
                scale: new Animated.Value(0),
                translate: new Animated.ValueXY(),
                fade: new Animated.Value(0),
            }
        };
    }

    measureContent(e) {
        let {width, height} = e.nativeEvent.layout;
        let contentSize = {width, height};
        let geom = this.computeGeometry({contentSize});

        let isAwaitingShow = this.state.isAwaitingShow;
        this.setState(Object.assign(geom,
            {contentSize, isAwaitingShow: undefined}), () => {
            // Once state is set, call the showHandler so it can access all the geometry
            // from the state
            isAwaitingShow && this._startAnimation({show: true});
        });
    }

    computeGeometry({contentSize, placement}) {
        placement = placement || this.props.placement;

        let options = {
            displayArea: this.props.displayArea,
            fromRect: this.props.fromRect,
            arrowSize: this.getArrowSize(placement),
            contentSize,
        };

        switch (placement) {
            case 'top':
                return Popover.computeTopGeometry(options);
            case 'bottom':
                return Popover.computeBottomGeometry(options);
            case 'left':
                return Popover.computeLeftGeometry(options);
            case 'right':
                return Popover.computeRightGeometry(options);
            default:
                return Popover.computeAutoGeometry(options);
        }
    }

    static computeTopGeometry({displayArea, fromRect, contentSize, arrowSize}) {
        let popoverOrigin = new Point(
            Math.min(displayArea.x + displayArea.width - contentSize.width,
                Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
            fromRect.y - contentSize.height - arrowSize.height);
        let anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y);

        return {
            popoverOrigin,
            anchorPoint,
            placement: 'top',
        }
    }

    static computeBottomGeometry({displayArea, fromRect, contentSize, arrowSize}) {
        let popoverOrigin = new Point(
            Math.min(displayArea.x + displayArea.width - contentSize.width,
                Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
            fromRect.y + fromRect.height + arrowSize.height);
        let anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y + fromRect.height);

        return {
            popoverOrigin,
            anchorPoint,
            placement: 'bottom',
        }
    }

    static computeLeftGeometry({displayArea, fromRect, contentSize, arrowSize}) {
        let popoverOrigin = new Point(fromRect.x - contentSize.width - arrowSize.width,
            Math.min(displayArea.y + displayArea.height - contentSize.height,
                Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)));
        let anchorPoint = new Point(fromRect.x, fromRect.y + fromRect.height / 2.0);

        return {
            popoverOrigin,
            anchorPoint,
            placement: 'left',
        }
    }

    static computeRightGeometry({displayArea, fromRect, contentSize, arrowSize}) {
        let popoverOrigin = new Point(fromRect.x + fromRect.width + arrowSize.width,
            Math.min(displayArea.y + displayArea.height - contentSize.height,
                Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)));
        let anchorPoint = new Point(fromRect.x + fromRect.width, fromRect.y + fromRect.height / 2.0);

        return {
            popoverOrigin,
            anchorPoint,
            placement: 'right',
        }
    }

    static computeAutoGeometry({displayArea, contentSize}) {
        let placementsToTry = ['left', 'right', 'bottom', 'top'], geom;

        for (let i = 0; i < placementsToTry.length; i++) {
            let placement = placementsToTry[i];
            geom = this.computeGeometry({contentSize: contentSize, placement: placement});
            let {popoverOrigin} = geom;

            if (popoverOrigin.x >= displayArea.x
                && popoverOrigin.x <= displayArea.x + displayArea.width - contentSize.width
                && popoverOrigin.y >= displayArea.y
                && popoverOrigin.y <= displayArea.y + displayArea.height - contentSize.height) {
                break;
            }
        }

        return geom;
    }

    getArrowSize(placement) {
        let size = this.props.arrowSize;
        switch (placement) {
            case 'left':
            case 'right':
                return new Size(size.width, size.height);
            default:
                return size;
        }
    }

    static getArrowColorStyle(color) {
        return {borderTopColor: color};
    }

    static getArrowRotation(placement) {
        switch (placement) {
            case 'bottom':
                return '180deg';
            case 'left':
                return '-90deg';
            case 'right':
                return '90deg';
            default:
                return '0deg';
        }
    }

    getArrowDynamicStyle() {
        let {anchorPoint, popoverOrigin} = this.state;
        let arrowSize = this.props.arrowSize;

        // Create the arrow from a rectangle with the appropriate borderXWidth set
        // A rotation is then applied dependending on the placement
        // Also make it slightly bigger
        // to fix a visual artifact when the popover is animated with a scale
        let width = arrowSize.width + 2;
        let height = arrowSize.height * 2 + 2;

        return {
            left: anchorPoint.x - popoverOrigin.x - width / 2,
            top: anchorPoint.y - popoverOrigin.y - height / 2,
            width: width,
            height: height,
            borderTopWidth: height / 2,
            borderRightWidth: width / 2,
            borderBottomWidth: height / 2,
            borderLeftWidth: width / 2,
        }
    }

    getTranslateOrigin() {
        let {contentSize, popoverOrigin, anchorPoint} = this.state;
        let popoverCenter = new Point(popoverOrigin.x + contentSize.width / 2,
            popoverOrigin.y + contentSize.height / 2);
        return new Point(anchorPoint.x - popoverCenter.x, anchorPoint.y - popoverCenter.y);
    }

    componentWillReceiveProps(nextProps) {
        let willBeVisible = nextProps.isVisible;
        let {
            isVisible,
        } = this.props;

        if (willBeVisible !== isVisible) {
            if (willBeVisible) {
                // We want to start the show animation only when contentSize is known
                // so that we can have some logic depending on the geometry
                this.setState({contentSize: {}, isAwaitingShow: true});
            } else {
                this._startAnimation({show: false});
            }
        }
    }

    _startAnimation({show}) {
        let handler = this.props.startCustomAnimation || this._startDefaultAnimation;
        handler.call(this, {show, doneCallback: () => this.setState({isTransitioning: false})});
        this.setState({isTransitioning: true});
    }

    _startDefaultAnimation({show, doneCallback}) {
        let animationDuration = 300;
        let values = this.state.defaultAnimatedValues;
        let translateOrigin = this.getTranslateOrigin();

        if (show) {
            values.translate.setValue(translateOrigin);
        }

        let commonConfig = {
            duration: animationDuration,
            easing: show ? Easing.out(Easing.back()) : Easing.inOut(Easing.quad),
        };

        Animated.parallel([
            Animated.timing(values.fade, {
                toValue: show ? 1 : 0,
                ...commonConfig,
            }),
            Animated.timing(values.translate, {
                toValue: show ? new Point(0, 0) : translateOrigin,
                ...commonConfig,
            }),
            Animated.timing(values.scale, {
                toValue: show ? 1 : 0,
                ...commonConfig,
            })
        ]).start(doneCallback);
    }

    _getDefaultAnimatedStyles() {
        // If there's a custom animation handler,
        // we don't return the default animated styles
        if (typeof this.props.startCustomAnimation !== 'undefined') {
            return null;
        }

        let animatedValues = this.state.defaultAnimatedValues;

        return {
            backgroundStyle: {
                opacity: animatedValues.fade,
            },
            arrowStyle: {
                transform: [
                    {
                        scale: animatedValues.scale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    }
                ],
            },
            contentStyle: {
                transform: [
                    {translateX: animatedValues.translate.x},
                    {translateY: animatedValues.translate.y},
                    {scale: animatedValues.scale},
                ],
            }
        };
    }

    _getExtendedStyles() {
        let background = [];
        let popover = [];
        let arrow = [];
        let content = [];

        [this._getDefaultAnimatedStyles(), this.props].forEach((source) => {
            if (source) {
                background.push(source.backgroundStyle);
                popover.push(source.popoverStyle);
                arrow.push(source.arrowStyle);
                content.push(source.contentStyle);
            }
        });

        return {
            background,
            popover,
            arrow,
            content,
        }
    }

    render() {
        if (!this.props.isVisible && !this.state.isTransitioning) {
            return null;
        }

        let {popoverOrigin, placement} = this.state;
        let extendedStyles = this._getExtendedStyles();
        let contentStyle = [styles.content, ...extendedStyles.content];
        let arrowColor = StyleSheet.flatten(contentStyle).backgroundColor;
        let arrowColorStyle = Popover.getArrowColorStyle(arrowColor);
        let arrowDynamicStyle = this.getArrowDynamicStyle();
        let contentSizeAvailable = this.state.contentSize.width;

        // Special case, force the arrow rotation even if it was override
        let arrowStyle = [styles.arrow, arrowDynamicStyle, arrowColorStyle, ...extendedStyles.arrow];
        let arrowTransform = (StyleSheet.flatten(arrowStyle).transform || []).slice(0);
        arrowTransform.unshift({rotate: Popover.getArrowRotation(placement)});
        let contentMarginRight = this.props.contentMarginRight ? this.props.contentMarginRight : 0;
        return (
            <TouchableWithoutFeedback onPress={() => this.props.onClose()}>
                <View style={[styles.container, contentSizeAvailable && styles.containerVisible]}>
                    <Animated.View style={[styles.background, ...extendedStyles.background]}/>
                    <Animated.View style={[styles.popover, {
                        top: popoverOrigin.y,
                        left: popoverOrigin.x - contentMarginRight,
                    }, ...extendedStyles.popover]}>
                        <Animated.View ref='content' onLayout={e => this.measureContent(e)}
                                       style={[contentStyle, this.props.contentStyle,]}>
                            {this.props.children}
                        </Animated.View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        opacity: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        backgroundColor: 'transparent',
    },
    containerVisible: {
        opacity: 1,
    },
    background: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
    },
    popover: {
        backgroundColor: 'transparent',
        position: 'absolute',
    },
    content: {
        borderRadius: 3,
        padding: 6,
        backgroundColor: '#fff',
        shadowColor: 'gray',
        shadowOffset: {width: 2, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.8,
    },
    arrow: {
        position: 'absolute',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
});
