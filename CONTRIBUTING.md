# Contributing

There are three main ways you can contribute to Project Vyasa:

1. [Adding new content](#adding-new-content).

2. Reporting errors in already published content by filing a 
    [GitHub issue](https://github.com/pmarathe25/Project-Vyasa/issues).

3. Improving the website itself! If there are any features you'd like to add
    or change, you can create a pull request to this repository.

## Adding New Content

Before adding new content, you should familiarize yourself with the content
format outlined in the [README](./README.md#content-format).

After you've followed the [set-up instructions](./README.md#set-up) there, 
the steps are fairly simple:

1. Add your word-by-word text and translation under the relevant text file
    in `content/raw/text/`.

2. For any new words, add entries to the dictionary in `content/raw/dictionary/`.

3. Finally, run `make launch` to build and launch a local copy of the website. 
    This will show you error messages if there are any words that were missing from 
    the dictionary or any syntax errors in your new content.
    Once it launches successfully, navigate to http://localhost:8000/ to see it!