
export { type BlogPost } from './repository/blog-repo';
import { getBlogRepository } from './repository/blog-repo';

export async function getPost(slug: string) {
    const repo = getBlogRepository();
    return repo.getPostBySlug(slug);
}

export async function getAllPosts() {
    const repo = getBlogRepository();
    return repo.getAllPosts();
}
