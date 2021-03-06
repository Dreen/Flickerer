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
			it('generic text query - should return 100 results', function(done)
			{
				var fl = new Flickerer(el);

				fl.search({'text':'a'}, function(ret)
				{
					assert.equal(ret.photos.total, '100');
					done();
				});
			});

			it('specific query - should only return 1 photo', function(done)
			{
				var fl = new Flickerer(el);

				fl.search({
					'user_id': '97740566@N04',
					'text': 'DSCN9791'
				}, function(ret)
				{
					assert.equal(ret.photos.total, '1');
					assert.equal(ret.photos.photo[0].id, '9085891029');
					done();
				});
			});
		});
	});
});