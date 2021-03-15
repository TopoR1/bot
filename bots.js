// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ogar69.yuu.dev/
// @grant        none
// ==/UserScript==

let bots = 0;
const es = new EventSource('https://eu.ogar69.yuu.dev/gateway');

es.addEventListener('servers', (data) => {
    if (bots > 499) return;
    bots++;

    let playing = false;

    data = JSON.parse(data.data);

    let server = {};

    for (const i of data) {
        if (i.name == 'Omega') server = i;
    }

    const ws = new WebSocket(`wss://eu.ogar69.yuu.dev:${server.endpoint}?`);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => {
        //handshake
        const writer = new BinaryWriter();
        writer.writeUInt8(69);
        writer.writeInt16(420);
        writer.writeUTF16String('Bot'); // nick
        writer.writeUTF16String(''); // skin1
        writer.writeUTF16String(''); // skin2
        ws.send(writer.finalize());

        const s = new BinaryWriter();
        s.writeUInt8(1);
        s.writeUTF16String('Bot');
        s.writeUTF16String('');
        s.writeUTF16String('');
        ws.send(s.finalize());
    };
    ws.onmessage = function(message) {
        const reader = new BinaryReader(new DataView(message.data));

        if (reader.readUInt8() == 4) {
            const dv = new DataView(message.data, 1, 24);
            dv.getUint8(0); // pid
            const mycells = dv.getUint16(1, true);

            if (mycells) {
                playing = true;

                const writer = new BinaryWriter();
                writer.writeUInt8(3);
                writer.writeFloat32(0);
                writer.writeFloat32(0);
                writer.writeUInt8(0);
                writer.writeUInt8(0);
                writer.writeUInt8(0);
                writer.writeUInt8(0);
                writer.writeUInt8(0);
                writer.writeUInt8(0);
                ws.send(writer.finalize());
            } else if (playing) {
                const s = new BinaryWriter();
                s.writeUInt8(1);
                s.writeUTF16String('Bot');
                s.writeUTF16String('');
                s.writeUTF16String('');
                ws.send(s.finalize());
                playing = false;
            }
        }
    };
});


const r = new DataView(new ArrayBuffer(1048576));
class BinaryWriter {
    constructor(e = true) {
        this.offset = 0;
        this.le = e;
    }
    writeUInt8(e) {
        r.setUint8(this.offset++, e);
    }
    writeInt8(e) {
        r.setInt8(this.offset++, e);
    }
    writeUInt16(e) {
        r.setUint16(this.offset, e, this.le);
        this.offset += 2;
    }
    writeInt16(e) {
        r.setInt16(this.offset, e, this.le);
        this.offset += 2;
    }
    writeUInt32(e) {
        r.setUint32(this.offset, e, this.le);
        this.offset += 4;
    }
    writeInt32(e) {
        r.setInt32(this.offset, e, this.le);
        this.offset += 4;
    }
    writeFloat32(e) {
        r.setFloat32(this.offset, e, this.le);
        this.offset += 4;
    }
    writeFloat64(e) {
        r.setFloat64(this.offset, e, this.le);
        this.offset += 8;
    }
    writeUTF8String(e) {
        for (let t = 0; t < e.length; t++)
            this.writeUInt8(e.charCodeAt(t));
        this.writeUInt8(0);
    }
    writeUTF16String(e) {
        for (let t = 0; t < e.length; t++)
            this.writeUInt16(e.charCodeAt(t));
        this.writeUInt16(0);
    }
    skip(e = 0) {
        this.offset += e;
    }
    finalize() {
        return r.buffer.slice(0, this.offset);
    }
}

class BinaryReader {
    constructor(e, t = true) {
        this.view = e,
            this.offset = 0,
            this.le = t
    }
    get length() {
        return this.view.byteLength
    }
    get EOF() {
        return this.offset === this.view.byteLength
    }
    readUInt8() {
        return this.view.getUint8(this.offset++)
    }
    readInt8() {
        return this.view.getInt8(this.offset++)
    }
    readUInt16() {
        const e = this.view.getUint16(this.offset, this.le);
        return this.offset += 2,
            e
    }
    readInt16() {
        const e = this.view.getUint16(this.offset, this.le);
        return this.offset += 2,
            e
    }
    readUInt32() {
        const e = this.view.getUint32(this.offset, this.le);
        return this.offset += 4,
            e
    }
    readInt32() {
        const e = this.view.getInt32(this.offset, this.le);
        return this.offset += 4,
            e
    }
    readFloat32() {
        const e = this.view.getFloat32(this.offset, this.le);
        return this.offset += 4,
            e
    }
    readFloat64() {
        const e = this.view.getFloat64(this.offset, this.le);
        return this.offset += 8,
            e
    }
    skip(e) {
        this.offset += e
    }
    readUTF8String() {
        const e = [];
        for (; this.offset < this.view.byteLength;) {
            const t = this.readUInt8();
            if (!t)
                break;
            e.push(String.fromCharCode(t))
        }
        return e.join("")
    }
    readUTF16String(e = !1) {
        const t = [];
        if (e)
            for (; this.offset < this.view.byteLength;) {
                const e = this.readUInt16();
                if (!e)
                    break;
                t.push(String.fromCharCode(255 & e))
            }
        else
            for (; this.offset < this.view.byteLength;) {
                const e = this.readUInt16();
                if (!e)
                    break;
                t.push(String.fromCharCode(e))
            }
        return t.join("")
    }
    readBytes(e = 0) {
        const t = this.view.buffer.slice(this.offset, this.offset + e);
        return this.offset += e,
            t
    }
}
