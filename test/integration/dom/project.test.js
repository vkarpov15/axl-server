describe('Viewing my projects', function() {
  it('should work', function() {
    browser().navigateTo('/#/');
    expect(element('#username').text()).toContain('vkarpov15');

    api('get', '/api/me/projects', 
    {
      projects: [
        {
          name: 'mongo-sanitize'
        }
      ]
    });

    browser().navigateTo('#/projects');
    expect(repeater('.my-project').count()).toBe(1);
    expect(element('.project-name').text()).toContain('mongo-sanitize');
  });
});

describe('Creating a project', function() {
  it('should allow user to create a project and then redirect', function() {
    browser().navigateTo('/#/');

    var data;
    api('get', '/api/me/projects', {
      projects: data
    });

    browser().navigateTo('#/projects/new');

    var data;
    api(
      'post',
      '/api/project',
      {
        project: {}
      });

    input('project.name').enter('mongo-tool');
    input('project.data.description').enter('This is a test');
    input('newMaintainer').enter('vkarpov15');
    element('#add-maintainer').click();
    expect(repeater('.maintainer').count()).toBe(1);
    input('newKeyword').enter('mongo');
    element('#add-keyword').click();
    expect(repeater('.keyword').count()).toBe(1);
    element('#save').click();

    var expected = {
      name: 'mongo-tool',
      data: {
        keywords: ['mongo'],
        maintainers: [{ username: 'vkarpov15' }]
      },
      downloadsCount: 0,
      releases: []
    };
    expect(apiPosted('count')).toEqual(1);
    expect(apiPosted('path', '0.name')).toEqual('mongo-tool');
    expect(apiPosted('path', '0.data.keywords.0')).toEqual('mongo');
    expect(apiPosted('path', '0.data.maintainers.0.username')).
      toEqual('vkarpov15');
    expect(apiPosted('path', '0.data.description')).
      toEqual('This is a test');
  });
});