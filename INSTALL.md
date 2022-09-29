# Setting Up For Local Development


## Introduction

The instructions here assume you are running Ubuntu, but similar steps should work
on other platforms.


## Set Up

1. Clone this repository:

    If you've set up SSH keys, do:

    ```bash
    git clone git@github.com:pmarathe25/Project-Vyasa.git
    ```

    Otherwise, use:

    ```bash
    git clone https://github.com/pmarathe25/Project-Vyasa.git
    ```

2. [Install `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm):

    ```bash
    sudo apt install -y npm
    ```

3. Update `node` and `npm`:

    ```bash
    sudo npm install -g node npm
    ```

3. Install the Gatsby CLI client:

    ```bash
    sudo npm i -g gatsby-cli
    ```

4. Navigate to the repository directory and install required packages:

    ```bash
    cd ./Project-Vyasa
    npm i
    ```

5. Install packages required for testing:

    ```bash
    sudo apt install python3-pip
    python3 -m pip install --upgrade pip
    python3 -m pip install -r tests/requirements.txt
    ```

6. Launch the local web server:

    ```bash
    make launch
    ```

At this point, you should be able to navigate to http://localhost:8000/ in your
browser to view your local copy of the site.


## Updating Dependencies Automatically

To update the project's dependencies, you can use the `npm-check-updates` package.

1. Install the package:

    ```bash
    sudo npm i -g npm-check-updates
    ```

2. Update dependencies:

    ```bash
    ncu -u
    ```

3. Install new dependencies:

    ```bash
    npm i
    ```