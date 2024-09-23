function escapeDollar(str) {
    return str.replace(/[$]/gi, '')
}

console.log(escapeDollar('$hello world$'))