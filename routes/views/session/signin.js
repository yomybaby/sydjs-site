var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'session';
	locals.form = req.body;
	
	view.on('post', { action: 'signin' }, function(next) {
		
		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}
		
		var onSuccess = function() {
			if (req.body.target && !/join|signin/.test(req.body.target)) {
				console.log('[signin] - Set target as [' + req.body.target + '].');
				res.redirect(req.body.target);
			} else {
				res.redirect('/me');
			}
		}
		
		var onFail = function() {
			req.flash('error', '이메일과 비밀번호가 일치하지 않습니다. 다시 시도해주세요.<br/>tidev.kr 포럼에 가입되어 있더라도 본 meetup 사이트는 별도로 가입 해주서야 합니다.');
			return next();
		}
		
		keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
		
	});
	
	view.render('session/signin');
	
}
