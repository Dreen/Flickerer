var Flickerer = (function($)
{
	function F(el)
	{
		this._el = el;
	}

	F.prototype.say = function(msg)
	{
		$msgbox = $('<div class="msgbox"><a class="cls" href="#">X</a><br />' + msg + '</div>');
		$msgbox.find('.cls').click(function()
		{
			$msgbox.fadeOut();
		});
		$msgbox.appendTo('body');
	}

	F.prototype.about = function()
	{
		this.say('Created by Greg Balaga &lt;<a href="mailto:greg.balaga@gmail.com">greg.balaga@gmail.com</a>&gt;<br />' +
				'Hosted on GitHub: <a href="https://github.com/Dreen/Flickerer">github.com/Dreen/Flickerer</a>');
	};

	return F;
})(jQuery);