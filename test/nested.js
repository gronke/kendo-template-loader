describe('kendo-template-loader nested templates', function() {

	var ktl;
	beforeEach(function() {
		ktl = new KendoTemplateLoader();
		$('script[type="text/x-kendo-template"]').remove();
	});

	it('should be able to load templates from a subdirectory with -- delimiter', function(done) {

		$.when(ktl.getTemplate('nested--nested-item'))
		.done(function(data) {
			expect(data).to.be.equal('<div>Nested Item</div>');
			done();
		});

	});

});
