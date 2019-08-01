const FindBug = (function (global) {
    const utils = {
        getStackTrace() {
            const obj = {};
            Error.captureStackTrace(obj, this);
            const info = (obj.stack || '').split(/\s+/);
            const pathInfo = info[info.length - 1];
            const pathArray = (pathInfo.match(/:(\d+):(\d+)$/) || {});
            const nameArray = (pathInfo.substr(0, pathArray.index || 0) || '').split('/');
            const name = nameArray[nameArray.length] || 'index.html';
            return {
                name,
                line: pathArray[1] || 1,
                column: pathArray[2] || 1,
            };
        },
        initEvent(findBug) {
            window.addEventListener('hashchange', (e) => {
                const { newURL, oldURL } = e;
                findBug.addStack('hash', `${oldURL} to ${newURL}`);
            });
        },
    };


    class FindBug {
        stack = []
        user = {}
        extra = {}
        version = ''
        config = {
            stack: 15,
        }

        constructor(options = {}) {
            const {
                version = '', extra = {}, user = {}, upload,
            } = options;
            if (version === '') console.error('version 必须！');
            this.version = version;
            this.extra = extra;
            this.user = user;
            if (upload) this.upload = upload;
            if (!global.__findBug) global.__findBug = this;
            utils.initEvent(this);
        }

        upload(options) {
            console.log(options);
        }

        uploadError(pathInfo, info, option) {
            const {
                version, extra, user, upload, stack,
            } = this;
            upload({
                pathInfo,
                extra,
                stack,
                info,
                level: 'error',
                version,
                ...option,
                ...user,
            });
        }

        captureException(msg, option = {}) {
            const pathInfo = utils.getStackTrace();
            this.uploadError(pathInfo, msg, option);
        }

        captureExceptionReact(error, option = {}) {
            const errorInfo = error.stack.split(/\n/) || [];
            const info = errorInfo[0];
            const fileName = errorInfo[1];
            const fileArray = fileName.match(/\(.+\/([^/]+?)\??:(\d+):(\d+)\)/) || [];
            this.uploadError({
                name: fileArray[1] || 'index.html',
                line: fileArray[2] || 1,
                column: fileArray[3] || 1,
            }, info, option);
        }

        addStack(type = 'msg', info = '') {
            this.stack.unshift({
                type,
                info,
            });
            this.stack.slice(0, this.config.stack);
        }

        setExtra(options = {}) {
            this.extra = options;
        }

        // 设置用户信息
        setUser(options = {}) {
            this.user = options;
        }
    }


    return FindBug;
}(window));

export default FindBug;
