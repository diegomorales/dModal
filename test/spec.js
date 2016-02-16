var $ = jQuery,
    fixture,
    modal,
    options = { moveToBodyEnd: false}, // always use this option for testing, because it doesn't play nice with fixtures.
    customMatchers = {
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

// Note: after opening modal always use jasmine.clock().tick(50) because of setTimeout in open method.

describe('MiniModal', function() {
    jasmine.getFixtures().fixturesPath = 'base/test';

    beforeEach(function() {
        loadFixtures('fixture.html');
        jasmine.addMatchers(customMatchers);
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();

        // always reset changes outside of fixture container.
        $('body')[0].className = '';

        modal = null;
    });

    it('is in global namespace', function() {
        expect('MiniModal' in window).toBe(true);
    });

    it('has static close/open method', function() {
        expect(MiniModal).toHaveProperty('close');
        expect(MiniModal).toHaveProperty('open');
    });

    it('is instanciated correctly', function() {
        modal = new MiniModal('modal', options);
        expect(modal instanceof MiniModal).toBe(true);
    });

    it('returns object with error message if id doesn\'t exist', function() {
        modal = new MiniModal('not-found');
        expect(modal).toHaveProperty('error');
    });

    it('is opened correctly', function() {
        modal = new MiniModal('modal', options);

        jasmine.clock().tick(100);

        expect($('body')).toHaveClass('mini-modal--open');
        expect($('#modal')).toHaveClass('open');
    });

    it('closes active modal with static method', function() {
        modal = new MiniModal('modal', options);
        jasmine.clock().tick(50);

        MiniModal.close();
        expect($('body')).not.toHaveClass('mini-modal--open');
        expect($('#modal')).not.toHaveClass('open');
    });

    it('opens modal with static open method and returns MiniModal instance', function() {
        modal = MiniModal.open('modal');
        jasmine.clock().tick(50);

        expect($('body')).toHaveClass('mini-modal--open');
        expect($('#modal')).toHaveClass('open');
        expect(modal instanceof MiniModal).toBe(true);
    });
});
