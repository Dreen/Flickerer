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
	function F(el)
	{
		this.$el = el;

	}

	/*
	 * Run a search query
	 */
	F.prototype.search = function(params, onFinish)
	{
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