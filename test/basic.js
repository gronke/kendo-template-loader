describe('kendo-template-loader', function() {

	var ktl;
	beforeEach(function() {
		ktl = new KendoTemplateLoader();
		$('script[type="text/x-kendo-template"]').remove();
	});

	it('should automatically load template ', function(done) {

		$.when(ktl.getTemplate('valid'))
		.done(function(data) {
			expect(data).to.be.equal('<div>Hello World</div>');
			done();
		})
		.fail(function(e) {
			throw new Error('fixture template "unknown" not found');
			done();
		});

	});

	it('should not be able to lookup template that was never loaded', function(done) {

		$.when(ktl.lookupTemplate('valid'))
		.done(function(data) {
			throw new Error('template should not exist');
			done();
		})
		.fail(function() {
			done();
		});

	});

	it('should be able to lookup template that was previously loaded', function(done) {

		$.when(ktl.getTemplate('valid'))
		.done(function() {
			
			$.when(ktl.lookupTemplate('valid'))
			.done(function(data) {
				expect(data).to.be.equal('<div>Hello World</div>');
				done();
			})
			.fail(function(e) {
				throw new Error('lookup failed');
			});
		})
		.fail(function(e) {
			throw new Error('fixture template "unknown" not found');
			done();
		});

	});

	it('require 2 templates should load both', function (done) {

	    $.when(ktl.require('valid', 'valid2'))
		.done(function (data, data2) {
		    expect(data).to.be.equal('<div>Hello World</div>');
		    expect(data2).to.be.equal('<div>Hello World 2</div>');
		    done();
		})
		.fail(function (e) {
		    throw new Error('fixture template "unknown" not found');
		    done();
		});

	});

});
