import BigNumber from "bignumber.js";

export function bytes32ToToken(data) {
    try{
        let index = data.indexOf("00", 2);
        let bytes = Buffer.from(data.substring(2, index), "hex");

        return String.fromCharCode.apply(String, bytes).trim();
    }catch (e) {
        return null
    }
}

export function tokenToBytes(token) {
    try {
        let bytes = Buffer.alloc(32);
        bytes.fill(token, 0, token.length);
        return "0x" + bytes.toString('hex');
    } catch (e) {
        return null;
    }
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

export function trimNumber(numberStr, decimalPlaces) {
    let vals = numberStr.split(".")
    if (vals.length < 2) {
        return numberStr;
    } else {
        let index = -1;
        let decimal = vals[1];
        for (let i = decimal.length - 1; i >= 0; i--) {
            if (decimal.charAt(i) != '0') {
                index = i;
                break;
            }
        }
        decimal = decimal.substring(0, index + 1);
        let numStr = vals[0];
        if (decimal.length > decimalPlaces) {
            decimal = decimal.substring(0, decimalPlaces);
        }
        if (decimal.length > 0) {
            numStr += "." + decimal;
        }
        return numStr
    }
}
