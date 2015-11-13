describe('kendo-template-loader', function() {

	it('should exist globally', function() {
		expect(window.KendoTemplateLoader).to.exist;
	});

	it('should have access to jQuery', function() {
		expect($).to.exist;
		expect(typeof($)).to.be.equal('function');
	});

	it('should exist globally', function(done) {

		var tl = new KendoTemplateLoader();

		$.when(tl.getTemplate('unknown'))
		.done(function(data) {
			expect(data).to.be.equal('<div>Unknown!</div>\n');
			done();
		})
		.fail(function(e) {
			throw new Error('fixture template "unknown" not found');
			done();
		});

	});

});
