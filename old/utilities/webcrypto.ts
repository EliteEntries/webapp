
export default class webcrypto {

    crypto: Crypto
    iv: Uint8Array
    algoEncrypt: {
        name: string,
        iv: Uint8Array,
        tagLength: number
    }

    constructor(crypto: Crypto) {
        this.crypto = crypto
        this.iv = crypto.getRandomValues(new Uint8Array(12));
        this.algoEncrypt = {
            name: 'AES-GCM',
            iv: this.iv,
            tagLength: 128
        }
    }

    strToArrayBuffer(str: string) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    arrayBufferToString(buf: any) {
        return String.fromCharCode.apply(null, (new Uint16Array(buf) as any));
    }

    algoKeyGen = {
        name: 'AES-GCM',
        length: 256
    }
    keyUsages = [
        'encrypt',
        'decrypt'
    ];

    async genKey() {
        const key = await this.crypto.subtle.generateKey(this.algoKeyGen, false, this.keyUsages as any)
        return key
    }

    async encrypt(key: CryptoKey, plainText: string) {
        const cipher = await this.crypto.subtle.encrypt(this.algoEncrypt, key, this.strToArrayBuffer(plainText))
        return cipher
    }

    async decrypt(key: CryptoKey, cipherText: BufferSource) {
        const message = this.arrayBufferToString(await this.crypto.subtle.decrypt(this.algoEncrypt, key, cipherText))
        return message
    }


}