class PlayMacroAction extends KeyAction implements Serializable<PlayMacroAction> {

    static keyActionTypeString = 'playMacro';
    static keyActionId = 245;

    private _macroId: number;

    get macroId(): number {
        return this._macroId;
    }

    set macroId(value) {
        if (!TypeChecker.isUInt8Valid(value)) {
            throw 'Invalid PlayMacroAction.macroId: ${value}';
        }
        this._macroId = value;
    }

    fromJsObject(jsObject: any): PlayMacroAction {
        this.macroId = jsObject.macroId;
        return this;
    }

    fromBinary(buffer: UhkBuffer): PlayMacroAction {
        this.macroId = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: PlayMacroAction.keyActionTypeString,
            macroId: this.macroId
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(PlayMacroAction.keyActionId);
        buffer.writeUInt8(this.macroId);
    }
}
