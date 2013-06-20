var Flickerer = (function($)
{
	var
	baseURL	= 'http://api.flickr.com/services/rest/',	
	apiKey	= 'c5d85dc681e1d7c60f1f3289b5e03396',
	baseReq	= {
		'format': 'json',
		'api_key': apiKey,
		'nojsoncallback': 1,
		'method': ''
	};

	function say(msg)
	{
		$msgbox = $('<div class="msgbox"><a class="cls" href="#">X</a><br />' + msg + '</div>');
		$msgbox.find('.cls').click(function()
		{
			$msgbox.fadeOut();
		});
		$msgbox.appendTo('body');
	}

	function F(el)
	{
		this.$el = el;
		//this.$el.append($('<'));
	}

	/*
	 * Return a worker for an API call
	 */
	F.prototype.go = function(methodName, data)
	{
		data = $.extend(data || {}, baseReq, {
			'method': methodName
		});

		var mirror = this;

		return function(onFinish)
		{
			$.post(baseURL, data, function(ret)
			{
				for (baseParam in baseReq)
				{
					delete ret[baseParam];
				}

				if (ret.stat == 'ok')
				{
					delete ret.stat;
					onFinish.call(mirror, ret);
				}
				else
				{
					say('Error processing request: ' + ret.message);
				}
			});
		};
	};

	F.prototype.about = function()
	{
		say('Created by Greg Balaga &lt;<a href="mailto:greg.balaga@gmail.com">greg.balaga@gmail.com</a>&gt;<br />' +
			'Hosted on GitHub: <a href="https://github.com/Dreen/Flickerer">github.com/Dreen/Flickerer</a>');
	};

	return F;
})(jQuery);