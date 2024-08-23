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
    const offset = parseInt(params.get('offset') || '0', 10);
    const limit = parseInt(params.get('limit') || '10', 10); // По умолчанию 10 элементов

    let filteredUsers = usersMock;

    // Фильтрация по имени
    if (searchTermByName) {
      const searchLowerCase = searchTermByName.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name?.first?.toLowerCase().includes(searchLowerCase) ||
        user.name?.last?.toLowerCase().includes(searchLowerCase)
      );
    }

    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return of(new HttpResponse({
      status: 200,
      body: {
        users: paginatedUsers,
        usersCount: filteredUsers.length
      }
    })).pipe(
      delay(200) // Задержка http запроса на 200мс
    );
  }


  return next(request);
}
