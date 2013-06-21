var Flickerer = (function($)
{
	var
	baseURL	= 'http://api.flickr.com/services/rest/',	// url for all API requests
	apiKey	= 'c5d85dc681e1d7c60f1f3289b5e03396',		// required API key
	baseReq	= {											// values sent with every request
		'format': 'json',
		'api_key': apiKey,
		'nojsoncallback': 1,
		'method': ''
	};

	/*
	 * Display a message box
	 */
	function say(msg)
	{
		$msgbox = $('<div class="msgbox"><a class="cls" href="#">X</a><br />' + msg + '</div>');
		$msgbox.find('.cls').click(function()
		{
			$msgbox.fadeOut();
		});
		$msgbox.appendTo('body');
	}




	/*
	 * Constructor
	 */
	function F(el, rows, columns)
	{
		rows = rows || 5;
		columns = columns || 10;

		if (!el)
		{
			say('Error initialising: No root element given');
			return;
		}
		else
			this.$el = el;

		// set up interface
		var $queryUI = $('<div class="query box">' +
        '<label>Title:</label><input type="text" id="query_text" /><br />' +
        '<label>Tags (use comma):</label><input type="text" id="query_tags" /><br />' +
        '<button>Search</button>' +
    	'</div><div class="result box">' +
        '<div class="pagination"></div>' +
        '</div>');
		$queryUI.find('button').click(function()
		{
			var query = {
				'text': $queryUI.find('#query_text').val(),
				'tags': $queryUI.find('#query_tags').val().split(',')
			};
			console.log(query);
		});
		$queryUI.appendTo(this.$el);
	}

	/*
	 * Run a search query
	 */
	F.prototype.search = function(params, onFinish)
	{
		if (typeof params != "object" || Object.keys(params).length === 0)
			say('Error: Empty search query.');
		else
			this.go('flickr.photos.search', params).call(this, onFinish);
	};

	/*
	 * Return a worker for an API call
	 */
	F.prototype.go = function(methodName, data)
	{
		data = $.extend(data || {}, baseReq, {
			'method': methodName
		});
		return function(onFinish)
		{
			$.post(baseURL, data, function(ret)
			{
				// before using the callback, remove all the meta-data from the response
				for (baseParam in baseReq)
				{
					delete ret[baseParam];
				}

				if (ret.stat == 'ok')
				{
					delete ret.stat;
					onFinish.call(this, ret);
				}
				else
				{
					console.log('%j', ret);
					say('Error processing request: ' + ret.message);
				}
			});
		};
	};

	/*
	 * Display software info
	 */
	F.prototype.about = function()
	{
		say('Created by Greg Balaga &lt;<a href="mailto:greg.balaga@gmail.com">greg.balaga@gmail.com</a>&gt;<br />' +
			'Hosted on GitHub: <a href="https://github.com/Dreen/Flickerer">github.com/Dreen/Flickerer</a>');
	};

	return F;
})(jQuery);