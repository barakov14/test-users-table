import {HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse} from "@angular/common/http";
import {delay, Observable, of} from "rxjs";
import {usersMock} from "../../../../public/users.mock";

export const usersMockInterceptor = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  if (request.url.endsWith('/api/users')) {

    // Извлекаем параметры из запроса
    const params = request.params;
    const searchTermByName = params.get('searchTermByName');

    let filteredUsers = usersMock;

    if (searchTermByName) {
      const searchLowerCase = searchTermByName.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name?.first?.toLowerCase().includes(searchLowerCase) ||
        user.name?.last?.toLowerCase().includes(searchLowerCase)
      );
    }

    return of(new HttpResponse({ status: 200, body: { users: filteredUsers, usersCount: filteredUsers.length } })).pipe(
      delay(200) // Задержка http запроса на 300мс
    );
  }

  return next(request);
}
