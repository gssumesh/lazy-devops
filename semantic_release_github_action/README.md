## Semantic release in non nodejs repo

- Add .releaserc to the root of the git repository
- Use `release.yml` as a github action workflow file to auto publish tag based on commit message
- Use `publish.yml` as a github action workflow file to perform action based on published tags