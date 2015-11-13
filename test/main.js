describe('kendo-template-loader', function() {

	it('should exist globally', function() {
		expect(window.KendoTemplateLoader).to.exist;
		expect(window.kendoTemplateLoader).to.exist;
	});

	it('should have access to jQuery', function() {
		expect($).to.exist;
		expect(typeof($)).to.be.equal('function');
	});

});
