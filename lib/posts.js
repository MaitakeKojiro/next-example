import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

// /posts のパスを取得
const postsDirectory = path.join(process.cwd(), 'posts')

// /posts以下のファイルを取得しソートしたデータ（文字列配列）を返す関数
export function getSortedPostsData() {
    // /posts 配下のファイル名を取得する
    const fileNames = fs.readdirSync(postsDirectory) // "posts" ディレクトリ直下のファイルやディレクトリ名全てが文字列の配列で返ってくる
    const allPostsData = fileNames.map(fileName => { // map関数は配列を変換する関数 

        // idを取得するためにファイル名から".md"を削除する
        const id = fileName.replace(/\.md$/, '')

        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName) // mdファイルのフルパスを取得
        const fileContents = fs.readFileSync(fullPath, 'utf8') // ファイルの中身をutf8の文字列を返す。

        // 投稿のメタデータ部分を解析するために gray-matter を使う
        const matterResult = matter(fileContents)

        // データをidと合わせる
        return {
            id,
            ...matterResult.data
        }
    })
    // 取得したデータを投稿日付でソートする
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}
// id(ファイル名の配列)を返す
export function getAllPostIds() {
    // /posts以下のファイルを取得
    const fileNames = fs.readdirSync(postsDirectory)
    // idにファイル名から.mdを削除したプロパティを設定したオブジェクトを返す。
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
    // 以下のような配列を返す
    // [
    //     {
    //         params: {
    //             id: 'ssg-ssr'
    //         }
    //     },
    //     {
    //         params: {
    //             id: 'pre-rendering'
    //         }
    //     }
    // ]
}

// idに基づいてブログの投稿データを返す
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`) // idからフルパスを取得
    const fileContents = fs.readFileSync(fullPath, 'utf8') // ファイルをutf8で読み込み

    // 投稿のメタデータ部分を解析するために gray-matter を使う
    const matterResult = matter(fileContents)

    // マークダウンを HTML 文字列に変換するために remark を使う
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // id と contentHtml と組み合わせたデータを返す
    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}