import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const COMMENT_API = 'http://localhost:8080/api/comment/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  public addCommentToPost(postId: number, message: string): Observable<any> {
    return this.http.post(COMMENT_API + postId + '/create', {
      message: message
    });
  }

  public getCommentsToPost(postId: number): Observable<any> {
    return this.http.get(COMMENT_API + postId + '/all');
  }

  public delete(commentId: number):Observable<any> {
    return this.http.post(COMMENT_API + commentId + '/delete', null);
  }
}
