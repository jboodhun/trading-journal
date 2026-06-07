import { Octokit } from '@octokit/rest'
import fs from 'node:fs'

const token = process.env.GITHUB_TOKEN
const repository = process.env.GITHUB_REPOSITORY
const prNumber = Number(process.env.PR_NUMBER)

if (!token || !repository || !Number.isInteger(prNumber)) {
  throw new Error('GITHUB_TOKEN, GITHUB_REPOSITORY, and PR_NUMBER are required.')
}

const octokit = new Octokit({ auth: token })
const [owner, repo] = repository.split('/')

function getChangedLineNumbers(patch = '') {
  const changedLines = new Set()
  let newLine = 0

  for (const line of patch.split('\n')) {
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/)

    if (hunk) {
      newLine = Number(hunk[1])
      continue
    }

    if (line.startsWith('+') && !line.startsWith('+++')) {
      changedLines.add(newLine)
      newLine += 1
      continue
    }

    if (!line.startsWith('-')) {
      newLine += 1
    }
  }

  return changedLines
}

function collectFileComments(file) {
  if (file.status === 'removed' || !file.patch || !fs.existsSync(file.filename)) {
    return []
  }

  const changedLines = getChangedLineNumbers(file.patch)
  const content = fs.readFileSync(file.filename, 'utf8')
  const lines = content.split('\n')
  const comments = []

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    if (!changedLines.has(lineNumber)) {
      return
    }

    if (line.includes('console.log')) {
      comments.push({
        path: file.filename,
        line: lineNumber,
        body: 'Remove `console.log` before merging.',
      })
    }
  })

  return comments
}

async function review() {
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100,
  })

  const comments = files.flatMap(collectFileComments)

  if (comments.length === 0) {
    return
  }

  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: prNumber,
    event: 'COMMENT',
    comments,
  })
}

await review()
