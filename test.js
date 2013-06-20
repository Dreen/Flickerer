var
assert	= require('assert'),
file	= require('fs').readFileSync,
jQuery	= require('jquery').create();

// load the global flickerer object, check if its defined
eval(file('./flickerer.js', 'utf8'));
if (!Flickerer)
	process.exit(1);

// fake element
var el = jQuery('document');

describe('Flickerer', function()
{
	describe('Flickr API', function()
	{
		it('testing go() with test.echo - should return input', function(done)
		{
			var fl = new Flickerer(el);

			fl.go('flickr.test.echo', {
				'foo': 'bar'
			})(function(ret)
			{
				assert.deepEqual(ret, {
					'foo': {"_content": "bar"}
				});
				done();
			});
		});

		describe('Search', function()
		{
			it('empty query - should return 100 photos', function(done)
			{
				var fl = new Flickerer(el);

				fl.search({}, function(ret)
				{
					assert.equal(ret.photos.photo.length, 100);
					done();
				});
			});
		});
	});
});