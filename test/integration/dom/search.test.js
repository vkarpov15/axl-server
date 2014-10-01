describe('Search page', function() {
  it('should work', function() {
    browser().navigateTo('/#/');

    api('get', '/api/search?q=test', 
    {
      projects: [
        {
          name: 'mongo-sanitize'
        }
      ]
    });

    browser().navigateTo('#/search');
    input('q').enter('test');
    element('#search-button').click();
    expect(repeater('.search-result').count()).toBe(1);
    expect(element('.search-result-name').text()).
      toContain('mongo-sanitize');
  });
});