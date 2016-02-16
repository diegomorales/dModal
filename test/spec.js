var customMatchers = {
        toHaveProperty: function(){
            return {
                compare: function(actual, expected){
                    var result = {};

                    if (expected === undefined) {
                        result.pass = false;
                        return result;
                    }

                    if (actual[expected] !== undefined)

                    result.pass = actual[expected] !== undefined;

                    return result;
                }
            };
        }
    };

describe('MiniModal', function() {

    beforeEach(function() {
        jasmine.addMatchers(customMatchers);
        loadFixtures('fixture.html');

    });

    jasmine.getFixtures().fixturesPath = 'base/test';

    it('is in global namespace', function() {
        expect('MiniModal' in window).toBe(true);
    });

    it('has static close method', function() {
        expect(MiniModal).toHaveProperty('close');
    });
});
