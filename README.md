# playwright-learning-ts
## Purpose
To learn how to use Playwright effectively within Typescript using Page Object Models, some basic handling of environment variables, and help you make architectural decisions along the way.
## Before We Start
We will be covering playwright in decent depth and the first question you must ask yourself is where you want your project to live. For the purpose of this project, we will be coding in a separate repository from developmental code.
Essentially, we will be following **black box** testing practices. Other options are **grey box** testing and **white box** testing.

Let's quickly cover what they mean. If you already know about this, and you are all ready to start implementing your framework, skip to [here](./Step-1/README.md).
### Black Box Testing
All developmental code and its implementations live in a black box that we do not have access to. We can only see what the user sees.
#### Pros
- See the software and functionality just as the user would which makes it user-centric.
- Ability to define your own patterns, linting, etc.
- QA has full control over their own space without developmental input (could be a con if your development team has good insights into automation though).
#### Cons
- Harder to find all edge cases because implementation details are unknown.
- Test runs and pipelines will be defined separately from development barring some triggers or more complex builds.
### White Box Testing
Automation framework has full access and visibility into developmental implementations. This usually means the automation is in the same repo and project structure as the dev code.
#### Pros
- If using test-id's, they can be centralized and reused meaning there is little work to track test id changes.
- Ability to see more edge cases since implementation details are visible
- Code can run alongside development and CI/CD pipelines can be easier to run since all code is in the same place.
- Development can clearly see the test cases written (could be a con depending on the team skillset)
#### Cons
- Linting, husky, etc. all has to be agreed on with developmental principles (could be a pro if your team is well rounded!)
- Unless using a project structure like `pnpm`, `package.json` could become hard to read and maintain.
### Grey Box
A little bit of black and white box! You can see the implementation details, but you still write tests as if you only saw things as the user. usually, it's just a mindset shift from white box testing.

There is no "best solution" as it depends on your organizational structure, how tightly coupled your teams are, team structure, etc. Hopefully this at least helps you create the automation in the right place!
# Table of Contents
### [Installation](./Step-1/README.md)
### [Writing your first test](./Step-2/README.md)