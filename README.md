# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

---

## Deploy to GitHub

To get your project on GitHub, follow these steps. You will need to have `git` installed on your local machine.

### Step 1: Create a New Repository on GitHub

1.  Go to [GitHub.com](https://github.com) and log in.
2.  Click the `+` icon in the top-right corner and select **"New repository"**.
3.  Give your repository a name (e.g., `my-projectflow-app`).
4.  You can add an optional description.
5.  Choose whether to make the repository public or private.
6.  **Important**: Do NOT initialize the repository with a README, .gitignore, or license file, as this project already contains those files.
7.  Click **"Create repository"**.

### Step 2: Push Your Existing Code

On the next page, GitHub will show you a URL for your new repository. Copy it. It will look something like `https://github.com/your-username/your-repository-name.git`.

Now, open a terminal or command prompt, navigate to your project's root directory, and run the following commands one by one.

1.  **Initialize Git**
    This command creates a new Git repository in your project folder.

    ```bash
    git init -b main
    ```

2.  **Add all files to staging**
    This command stages all the files in your project for the first commit.

    ```bash
    git add .
    ```

3.  **Commit the files**
    This command commits the staged files to your local repository.

    ```bash
    git commit -m "Initial commit"
    ```

4.  **Add the remote repository**
    This command tells your local Git repository where to push the code. **Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the URL you copied from GitHub.**

    ```bash
    git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
    ```

5.  **Push your code to GitHub**
    This command sends your committed code to your repository on GitHub.

    ```bash
    git push -u origin main
    ```

That's it! Your project code should now be on GitHub.
