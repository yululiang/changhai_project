async function test() {
    return new Promise((resolve, reject) =>　{
        setTimeout(() => {
            console.log(1111);
            resolve();
        }, 1000);
    });

}

async function test2() {
    return new Promise((resolve, reject) =>　{
        setTimeout(() => {
            console.log(2222);
            resolve();
        }, 1000);
    });
}

async function test3() {
    await test();
    await test2();
}

test3()