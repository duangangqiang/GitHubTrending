import React, {Component} from 'react';
import {Navigator} from 'react-native';

import WelcomePage from './WelcomePage';

// 进行一些初始化配置
function setup() {
    class Root extends Component {
        static renderScene(route, navigator) {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator}/>;
        }

        render() {
            return (
                <Navigator
                    initialRoute={{component: WelcomePage}}
                    renderScene={(route, navigator) => Root.renderScene(route, navigator)}
                />
            );
        }
    }

    return <Root />;
}

module.exports = setup;