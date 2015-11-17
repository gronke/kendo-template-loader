describe('kendo-template-loader recursive templates', function() {

	var ktl;
	beforeEach(function() {
		ktl = new KendoTemplateLoader();
		$('script[type="text/x-kendo-template"]').remove();
	});

	it('should load nested templates', function (done) {

	    $.when(ktl.getTemplate('parent'))
		.done(function (data) {
		    $.when(ktl.lookupTemplate('valid'))
			.done(function (data) {
			    expect(data).to.be.equal('<div>Hello World</div>');
			    done();
			})
            .fail(function (e) {
                throw new Error('the child template was not loaded');
                done();
            });
		})
		.fail(function (e) {
		    throw new Error('the parent template was not loaded');
		    done();
		});

	});

	it('should load deep nested templates', function (done) {

	    $.when(ktl.getTemplate('grandparent'))
		.done(function (data) {
		    $.when(ktl.lookupTemplate('valid'))
			.done(function (data) {
			    expect(data).to.be.equal('<div>Hello World</div>');
			    done();
			})
            .fail(function (e) {
                throw new Error('the child template was not loaded');
                done();
            });
		})
		.fail(function (e) {
		    throw new Error('the parent template was not loaded');
		    done();
		});

	});

	it('should handle recursions properly', function (done) {

		var ktlMock = new KendoTemplateLoaderMock();

	    $.when(ktlMock.getTemplate('recursion'))
		.done(function (data) {
			expect(ktlMock.mockStats.getTemplateCalls).to.be.equal(2);
			expect(ktlMock.mockStats.loadTemplateCalls).to.be.equal(1);
			expect($('script[type="text/x-kendo-template"]').length).to.be.equal(1);
			done();
		})
		.fail(function (e) {
		    throw new Error('the parent template was not loaded');
		    done();
		});

	});

});
