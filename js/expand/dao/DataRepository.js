export default class DataRepository {
    fetchNetRepository (url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => res.json())
                .then(result => {
                    resolve(result)
                })
                .catch(error => {
                    reject(error);
                })
        });
    }
}