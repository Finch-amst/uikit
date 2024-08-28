import {getNumericInputValidator, getParsedValue, getPossibleNumberSubstring} from '../utils';

describe('NumberInput utils', () => {
    describe('getNumericInputValidator', () => {
        describe('pattern', () => {
            test('correctly identifies numbers positiveOnly=true withoutFraction=true', () => {
                const {pattern} = getNumericInputValidator({
                    positiveOnly: true,
                    withoutFraction: true,
                });

                expect(RegExp(pattern).test('123')).toBeTruthy();
                expect(RegExp(pattern).test('+123')).toBeTruthy();
                expect(RegExp(pattern).test('-123')).toBeFalsy();
                expect(RegExp(pattern).test('123.45')).toBeFalsy();
                expect(RegExp(pattern).test('-123.45')).toBeFalsy();
                expect(RegExp(pattern).test('0')).toBeTruthy();
                expect(RegExp(pattern).test('123.0')).toBeFalsy();
                expect(RegExp(pattern).test('-123.0')).toBeFalsy();
            });
            test('correctly identifies numbers positiveOnly=true withoutFraction=false', () => {
                const {pattern} = getNumericInputValidator({
                    positiveOnly: true,
                    withoutFraction: false,
                });

                expect(RegExp(pattern).test('123')).toBeTruthy();
                expect(RegExp(pattern).test('+123')).toBeTruthy();
                expect(RegExp(pattern).test('-123')).toBeFalsy();
                expect(RegExp(pattern).test('123.45')).toBeTruthy();
                expect(RegExp(pattern).test('-123.45')).toBeFalsy();
                expect(RegExp(pattern).test('0')).toBeTruthy();
                expect(RegExp(pattern).test('123.0')).toBeTruthy();
                expect(RegExp(pattern).test('-123.0')).toBeFalsy();
            });
            test('correctly identifies numbers positiveOnly=false withoutFraction=true', () => {
                const {pattern} = getNumericInputValidator({
                    positiveOnly: false,
                    withoutFraction: true,
                });

                expect(RegExp(pattern).test('123')).toBeTruthy();
                expect(RegExp(pattern).test('+123')).toBeTruthy();
                expect(RegExp(pattern).test('-123')).toBeTruthy();
                expect(RegExp(pattern).test('123.45')).toBeFalsy();
                expect(RegExp(pattern).test('-123.45')).toBeFalsy();
                expect(RegExp(pattern).test('0')).toBeTruthy();
                expect(RegExp(pattern).test('123.0')).toBeFalsy();
                expect(RegExp(pattern).test('-123.0')).toBeFalsy();
            });
            test('correctly identifies numbers positiveOnly=false withoutFraction=false', () => {
                const {pattern} = getNumericInputValidator({
                    positiveOnly: false,
                    withoutFraction: false,
                });

                expect(RegExp(pattern).test('123')).toBeTruthy();
                expect(RegExp(pattern).test('+123')).toBeTruthy();
                expect(RegExp(pattern).test('-123')).toBeTruthy();
                expect(RegExp(pattern).test('123.45')).toBeTruthy();
                expect(RegExp(pattern).test('-123.45')).toBeTruthy();
                expect(RegExp(pattern).test('0')).toBeTruthy();
                expect(RegExp(pattern).test('123.0')).toBeTruthy();
                expect(RegExp(pattern).test('-123.0')).toBeTruthy();
            });
        });

        describe('validator', () => {
            test('validates numbers positiveOnly=true withoutFraction=true', () => {
                const {validator} = getNumericInputValidator({
                    positiveOnly: true,
                    withoutFraction: true,
                });

                expect(validator('123')).toBe(undefined);
                expect(validator('+123')).toBe(undefined);
                expect(validator('-123')).toBe('NEGATIVE_VALUE_IS_NOT_ALLOWED');
                expect(validator('123.45')).toBe('FRACTION_IS_NOT_ALLOWED');
                expect(validator('-123.45')).toBe('NEGATIVE_VALUE_IS_NOT_ALLOWED');
                expect(validator('0')).toBe(undefined);
                expect(validator('123.0')).toBe(undefined);
                expect(validator('-123.0')).toBe('NEGATIVE_VALUE_IS_NOT_ALLOWED');
                expect(validator('abc123def')).toBe('INCORRECT_NUMBER');
                expect(validator('')).toBe(undefined);
            });
            test('validates numbers positiveOnly=true withoutFraction=false', () => {
                const {validator} = getNumericInputValidator({
                    positiveOnly: true,
                    withoutFraction: false,
                });

                expect(validator('123')).toBe(undefined);
                expect(validator('+123')).toBe(undefined);
                expect(validator('-123')).toBe('NEGATIVE_VALUE_IS_NOT_ALLOWED');
                expect(validator('123.45')).toBe(undefined);
                expect(validator('-123.45')).toBe('NEGATIVE_VALUE_IS_NOT_ALLOWED');
                expect(validator('0')).toBe(undefined);
                expect(validator('123.0')).toBe(undefined);
                expect(validator('-123.0')).toBe('NEGATIVE_VALUE_IS_NOT_ALLOWED');
            });
            test('validates numbers positiveOnly=false withoutFraction=true', () => {
                const {validator} = getNumericInputValidator({
                    positiveOnly: false,
                    withoutFraction: true,
                });

                expect(validator('123')).toBe(undefined);
                expect(validator('+123')).toBe(undefined);
                expect(validator('-123')).toBe(undefined);
                expect(validator('123.45')).toBe('FRACTION_IS_NOT_ALLOWED');
                expect(validator('-123.45')).toBe('FRACTION_IS_NOT_ALLOWED');
                expect(validator('0')).toBe(undefined);
                expect(validator('123.0')).toBe(undefined);
                expect(validator('-123.0')).toBe(undefined);
            });
            test('validates numbers positiveOnly=false withoutFraction=false', () => {
                const {validator} = getNumericInputValidator({
                    positiveOnly: false,
                    withoutFraction: false,
                });

                expect(validator('123')).toBe(undefined);
                expect(validator('+123')).toBe(undefined);
                expect(validator('-123')).toBe(undefined);
                expect(validator('123.45')).toBe(undefined);
                expect(validator('-123.45')).toBe(undefined);
                expect(validator('0')).toBe(undefined);
                expect(validator('123.0')).toBe(undefined);
                expect(validator('-123.0')).toBe(undefined);
            });
            test('validates with custom min/max', () => {
                const {validator} = getNumericInputValidator({
                    positiveOnly: false,
                    withoutFraction: false,
                    min: -100,
                    max: 100,
                });
                expect(validator('100')).toBe(undefined);
                expect(validator('-100')).toBe(undefined);
                expect(validator('101')).toBe('NUMBER_GREATER_THAN_MAX_ALLOWED');
                expect(validator('-101')).toBe('NUMBER_LESS_THAN_MIN_ALLOWED');
                expect(validator('10')).toBe(undefined);
                expect(validator('-10')).toBe(undefined);
            });
            test('validates with default min/max', () => {
                const {validator} = getNumericInputValidator({
                    positiveOnly: false,
                    withoutFraction: false,
                });

                expect(validator('100')).toBe(undefined);
                expect(validator('-100')).toBe(undefined);
                expect(validator(String(Number.MIN_SAFE_INTEGER))).toBe(undefined);
                expect(validator(String(Number.MAX_SAFE_INTEGER))).toBe(undefined);
                expect(validator('100000000000000000')).toBe('NUMBER_GREATER_THAN_MAX_ALLOWED');
                expect(validator('-100000000000000000')).toBe('NUMBER_LESS_THAN_MIN_ALLOWED');
                expect(validator('10')).toBe(undefined);
                expect(validator('-10')).toBe(undefined);
            });
        });
    });
    describe('getPossibleNumberSubstring', () => {
        test('removes starting unit from negative integer number string', () => {
            expect(getPossibleNumberSubstring('$$$123')).toBe('123');
        });
        test('removes trailing unit from negative integer number string', () => {
            expect(getPossibleNumberSubstring('123k')).toBe('123');
        });
        test('removes units from negative integer number string', () => {
            expect(getPossibleNumberSubstring('-$123k')).toBe('-123');
        });
        test('removes units from integer number string', () => {
            expect(getPossibleNumberSubstring('$123k')).toBe('123');
        });
        test('removes units from negative number string with fraction', () => {
            expect(getPossibleNumberSubstring('- $123 456,78k')).toBe('-123456.78');
        });
        test('removes units from number string with fraction without sign', () => {
            expect(getPossibleNumberSubstring('$123.45k')).toBe('123.45');
        });
        test('returns undefined on invalid string', () => {
            expect(getPossibleNumberSubstring('$123abc.45k')).toBe(undefined);
        });
        test('returns empty string on empty value', () => {
            expect(getPossibleNumberSubstring('')).toBe('');
        });
        test('leaves unmodified sign only value', () => {
            expect(getPossibleNumberSubstring('-')).toBe('-');
        });
        test('leaves unmodified uncompleted value', () => {
            expect(getPossibleNumberSubstring('123.')).toBe('123.');
        });
    });
    describe('getParsedValue', () => {
        it('returns value itself', () => {
            expect(getParsedValue('-123.45')).toEqual({parsedValue: -123.45, isNumberValue: true});
        });
        it('returns zero on sign-only value', () => {
            expect(getParsedValue('-')).toEqual({parsedValue: 0, isNumberValue: false});
        });
        it('returns integer value for uncompleted double value', () => {
            expect(getParsedValue('123.')).toEqual({parsedValue: 123, isNumberValue: true});
        });
        it('returns zero on empty string', () => {
            expect(getParsedValue('')).toEqual({parsedValue: 0, isNumberValue: true});
        });
        it('returns zero on undefined value', () => {
            expect(getParsedValue('')).toEqual({parsedValue: 0, isNumberValue: true});
        });
        it('returns zero for NaN value', () => {
            expect(getParsedValue('abc123def')).toEqual({parsedValue: 0, isNumberValue: false});
        });
    });
});
