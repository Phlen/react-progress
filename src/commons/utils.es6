
// 动画方法 参数：动画对象(延迟，动画持续时间，操作，步骤)
export function animate (opts) {
    const start = new Date()
    const id = setInterval(() => {
        const timePassed = new Date() - start
        let progress = timePassed / opts.duration

        if (progress > 1) progress = 1

        const delta = opts.delta(progress)
        opts.step(delta)

        if (progress === 1) {
            clearInterval(id)
        }
    }, opts.delay || 10)
}
