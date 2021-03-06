import { reducer, initialState } from './user-configuration';
import {
    KeystrokeAction,
    KeystrokeType,
    SwitchLayerAction,
    UserConfiguration,
    LayerName,
    Keymap,
    SwitchLayerMode
} from 'uhk-common';

import { getDefaultUserConfig } from '../../../../test/user-config-helper';
import * as Keymaps from '../actions/keymap';

describe('user-configuration reducer', () => {
    it('should be initiate with default state', () => {
        const result = reducer(undefined, {} as any);
        expect(result).toEqual(initialState);
    });

    describe('SAVE_KEY', () => {
        it('should process KeyStrokeAction', () => {
            const defaultUserConfig = new UserConfiguration().fromJsonObject(getDefaultUserConfig());
            const state = { userConfiguration: new UserConfiguration().fromJsonObject(getDefaultUserConfig()) };
            const keystrokeAction = new KeystrokeAction({ _scancode: 100, type: KeystrokeType.basic } as any);
            const saveKeyAction: Keymaps.SaveKeyAction = {
                type: Keymaps.ActionTypes.SaveKey,
                payload: {
                    keymap: new Keymap(defaultUserConfig.keymaps[0]),
                    layer: 0,
                    module: 0,
                    key: 0,
                    keyAction: {
                        remapOnAllKeymap: false,
                        remapOnAllLayer: false,
                        action: keystrokeAction
                    }
                }
            };
            const result = reducer(state, saveKeyAction).userConfiguration;
            const expectedKeyAction = <KeystrokeAction>result.keymaps[0].layers[0].modules[0].keyActions[0];
            expect(expectedKeyAction).toEqual(keystrokeAction);
            expect(result).not.toBe(defaultUserConfig);
            // check key actions not changed on other layers
            for (let i = 1; i < result.keymaps[0].layers.length; i++) {
                const keyAction = result.keymaps[0].layers[i].modules[0].keyActions[0];
                const defaultKeyAction = defaultUserConfig.keymaps[0].layers[i].modules[0].keyActions[0];

                expect(keyAction).toEqual(defaultKeyAction);
            }
        });

        it('should copy the SwitchLayerAction to the destination layer', () => {
            const defaultUserConfig = new UserConfiguration().fromJsonObject(getDefaultUserConfig());
            const state = { userConfiguration: new UserConfiguration().fromJsonObject(getDefaultUserConfig()) };
            const destinationLayerId = LayerName.mod;
            const switchLayerAction = new SwitchLayerAction({
                switchLayerMode: SwitchLayerMode.toggle,
                layer: destinationLayerId
            } as any);

            const saveKeyAction: Keymaps.SaveKeyAction = {
                type: Keymaps.ActionTypes.SaveKey,
                payload: {
                    keymap: new Keymap(defaultUserConfig.keymaps[0]),
                    layer: 0,
                    module: 0,
                    key: 0,
                    keyAction: {
                        remapOnAllKeymap: false,
                        remapOnAllLayer: false,
                        action: switchLayerAction
                    }

                }
            };
            const result = reducer(state, saveKeyAction).userConfiguration;
            expect(result).not.toBe(defaultUserConfig);
            expect(result.toJsonObject()).toEqual({
                userConfigVersion: 4,
                moduleConfigurations: [
                    {
                        id: 1,
                        initialPointerSpeed: 1,
                        pointerAcceleration: 5,
                        maxPointerSpeed: 200
                    }
                ],
                keymaps: [
                    {
                        isDefault: true,
                        abbreviation: 'QWR',
                        name: 'QWERTY',
                        description: '',
                        layers: [
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'move',
                                        keyActions: [
                                            {
                                                keyActionType: 'switchLayer',
                                                layer: 'mod',
                                                switchLayerMode: 1
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 37
                                            },
                                            {
                                                keyActionType: 'switchLayer',
                                                layer: 'mod',
                                                switchLayerMode: 1
                                            }
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'move',
                                        keyActions: [
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 53
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 30
                                            },
                                            null
                                        ]
                                    },
                                    {
                                        id: 2,
                                        pointerRole: 'scroll',
                                        keyActions: []
                                    }
                                ]
                            },
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'none',
                                        keyActions: [
                                            {
                                                keyActionType: 'switchLayer',
                                                layer: 'mod',
                                                switchLayerMode: 1
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 65
                                            },
                                            {
                                                keyActionType: 'switchLayer',
                                                layer: 'mod',
                                                switchLayerMode: 1
                                            }
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'none',
                                        keyActions: [
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 41
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 58
                                            },
                                            null
                                        ]
                                    }
                                ]
                            },
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'move',
                                        keyActions: [
                                            null,
                                            null,
                                            null
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'scroll',
                                        keyActions: [
                                            null,
                                            {
                                                keyActionType: 'switchKeymap',
                                                keymapAbbreviation: 'DVO'
                                            },
                                            null
                                        ]
                                    }
                                ]
                            },
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'move',
                                        keyActions: [
                                            null,
                                            null,
                                            null
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'move',
                                        keyActions: [
                                            null,
                                            null,
                                            null
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                macros: []
            });
        });

        it('should copy the SwitchLayerAction to the destination layer and clear the modified', () => {
            const defaultUserConfig = new UserConfiguration().fromJsonObject(getDefaultUserConfig());
            const state = { userConfiguration: new UserConfiguration().fromJsonObject(getDefaultUserConfig()) };
            const destinationLayerId = LayerName.fn;
            const switchLayerAction = new SwitchLayerAction({
                switchLayerMode: SwitchLayerMode.toggle,
                layer: destinationLayerId
            } as any);

            const saveKeyAction: Keymaps.SaveKeyAction = {
                type: Keymaps.ActionTypes.SaveKey,
                payload: {
                    keymap: new Keymap(defaultUserConfig.keymaps[0]),
                    layer: 0,
                    module: 0,
                    key: 2,
                    keyAction: {
                        remapOnAllKeymap: false,
                        remapOnAllLayer: false,
                        action: switchLayerAction
                    }

                }
            };
            const result = reducer(state, saveKeyAction).userConfiguration;
            expect(result).not.toBe(defaultUserConfig);
            expect(result.toJsonObject()).toEqual({
                userConfigVersion: 4,
                moduleConfigurations: [
                    {
                        id: 1,
                        initialPointerSpeed: 1,
                        pointerAcceleration: 5,
                        maxPointerSpeed: 200
                    }
                ],
                keymaps: [
                    {
                        isDefault: true,
                        abbreviation: 'QWR',
                        name: 'QWERTY',
                        description: '',
                        layers: [
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'move',
                                        keyActions: [
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 36
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 37
                                            },
                                            {
                                                keyActionType: 'switchLayer',
                                                layer: 'fn',
                                                switchLayerMode: 1
                                            }
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'move',
                                        keyActions: [
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 53
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 30
                                            },
                                            null
                                        ]
                                    },
                                    {
                                        id: 2,
                                        pointerRole: 'scroll',
                                        keyActions: []
                                    }
                                ]
                            },
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'none',
                                        keyActions: [
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 64
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 65
                                            },
                                            null
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'none',
                                        keyActions: [
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 41
                                            },
                                            {
                                                keyActionType: 'keystroke',
                                                type: 'basic',
                                                scancode: 58
                                            },
                                            null
                                        ]
                                    }
                                ]
                            },
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'move',
                                        keyActions: [
                                            null,
                                            null,
                                            {
                                                keyActionType: 'switchLayer',
                                                layer: 'fn',
                                                switchLayerMode: 1
                                            }
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'scroll',
                                        keyActions: [
                                            null,
                                            {
                                                keyActionType: 'switchKeymap',
                                                keymapAbbreviation: 'DVO'
                                            },
                                            null
                                        ]
                                    }
                                ]
                            },
                            {
                                modules: [
                                    {
                                        id: 0,
                                        pointerRole: 'move',
                                        keyActions: [
                                            null,
                                            null,
                                            null
                                        ]
                                    },
                                    {
                                        id: 1,
                                        pointerRole: 'move',
                                        keyActions: [
                                            null,
                                            null,
                                            null
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                macros: []
            });
        });

    });
});
