import BigNumber from "bignumber.js";

export function bytes32ToToken(data) {
    let index = data.indexOf("00", 2);
    let bytes = Buffer.from(data.substring(2, index), "hex");

    return String.fromCharCode.apply(String, bytes).trim();
}

export function tokenToBytes(token) {
    let bytes = Buffer.alloc(32);
    bytes.fill(token, 0, token.length);
    return "0x" + bytes.toString('hex');
}

export function showValue(val, decimals, decimalPlaces) {
    if (!val) {
        val = 0;
    }
    if (!decimals) {
        decimals = 18;
    }
    if (!decimalPlaces) {
        decimalPlaces = 3;
    }
    let num = new BigNumber(val).dividedBy(new BigNumber(10).pow(decimals));

    return num.toFixed(decimalPlaces, 1);
}

export function showPK(pk, len) {
    if (!pk) {
        return "";
    }
    if (!len) {
        len = 8;
    }
    return pk.slice(0, len) + "..." + pk.slice(-len)
}