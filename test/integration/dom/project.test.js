describe('Creating a project', function() {
  it('should work', function() {
    browser().navigateTo('/#/');
    expect(element('#username').text()).toContain('vkarpov15');

    api('get', '/api/me/projects', 200, {
      projects: [
        {
          name: 'mongo-sanitize'
        }
      ]
    });

    browser().navigateTo('#/projects');
    expect(repeater('.my-project').count()).toBe(1);
  });
});

angular.scenario.dsl('api', function() {
  return function(verb, path, code, response) {
    return this.addFutureAction('tweaking api', function(window, document, done) {
      window.axlAPI.intercept(verb, path, response);
      done();
    });
  };
});