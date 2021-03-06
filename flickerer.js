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
	},
	maxPageLinks = 5;									// only display that many links in pagination before compacting them

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
		this.page = 1;

		if (!el)
		{
			say('Error initialising: No root element given');
			return;
		}
		else
			this.$el = el;

		// set up interface
		var $queryUI = $('<div class="query box">' +
        '<label>Title: </label><input type="text" id="query_text" /><br />' +
        '<label>Tags (use comma): </label><input type="text" id="query_tags" /><br />' +
        '<button>Search</button>' +
    	'</div><div class="result box">' +
        '<div class="pagination"></div>' +
        '<div class="images"></div>' +
        '<div id="backdrop">Click on the image to close</div></div>');
        var mirror = this;

        // draw photo results
        function searchLoadResults(res)
        {
        	$queryUI.find('.images').empty();
        	for (var i=0; i<res.photos.perpage; i++)
        	{
        		renderImageItem(res.photos.photo[i]);
        	}
        }
        // render a search result
        function renderImageItem(item)
        {
        	$queryUI.find('.images').append($('<img src="http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_s.jpg" />')
        		.click(function()
				{
					$queryUI.find('#backdrop').fadeIn();
					$('<img src="http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'.jpg" />')
						.addClass('fullImg')
						.appendTo($('body'))
						.click(function()
						{
							$queryUI.find('#backdrop').fadeOut();
							$(this).remove();
						});
				})
			);
        }
        // determine pagination
        function searchRebuildPagination(res, full)
        {
        	full = full || false;

        	var $pages = $queryUI.find('.pagination').empty().append('Page: ');
			for (var i=0; i<res.photos.pages; i++)
			{
				var p = i+1,
				is_ddd = res.photos.pages > maxPageLinks && p == maxPageLinks - 1 && !full;

				if (p == mirror.page)
					$pages.append(p);
				else
				{
					if (is_ddd)
					{
						$pages.append($('<a href="#">...</a><span> </span>').click(function()
						{
							searchRebuildPagination(res, true);
						}));
						i = res.photos.pages - 2;
					}
					else
						$pages.append($('<a href="#">'+p+'</a>').click(getSearchWorker(p, full)));
				}
				if (p < res.photos.pages && !is_ddd)
					$pages.append(', ');
			}
        }
        // return a function which performs a search
        function getSearchWorker(page, full)
		{
			page = page || 1;
			return function()
			{
				mirror.search({
					'text': $queryUI.find('#query_text').val(),
					'tags': $queryUI.find('#query_tags').val().split(','),
					'page': page
				}, function(res)
				{
					mirror.page = page;
					searchRebuildPagination(res, full);
					searchLoadResults(res);
				});
			};
		}
        // performing search function
		$queryUI.find('button').click(getSearchWorker());

		$queryUI.appendTo(this.$el);
	}

	/*
	 * Run a search query and return a json result
	 */
	F.prototype.search = function(params, onFinish)
	{
		if (typeof params != "object" || Object.keys(params).length === 0)
			say('Error: Empty search query.');
		else
		{
			this.go('flickr.photos.search', params).call(this, onFinish);
		}
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
			console.log(data);
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
					//console.log(ret);
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