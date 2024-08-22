import {HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse} from "@angular/common/http";
import {delay, Observable, of} from "rxjs";
import {usersMock} from "../../../../public/users.mock";

export const usersMockInterceptor = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  if(request.url.endsWith('/api/users')) {
    return of(new HttpResponse({ status: 200, body: {users: usersMock, usersCount: usersMock.length} })).pipe(
      delay(1000) /* Задержка http запроса на 1s */
    )
  }
  return next(request)
}
