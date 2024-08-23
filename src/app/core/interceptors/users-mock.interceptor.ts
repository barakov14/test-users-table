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
    const searchTermByName = params.get('searchTermByName') || '';
    const offset = parseInt(params.get('offset') || '0', 10);
    const limit = parseInt(params.get('limit') || '10', 10); // По умолчанию 10 элементов
    const excludeKeys = params.get('excludeKeys') ? params.get('excludeKeys')!.split(',') : [];
    const sortOrder = params.get('sortOrder') || 'asc'; // Порядок сортировки, по умолчанию 'asc'

    let filteredUsers = usersMock;

    // Фильтрация по имени
    if (searchTermByName.trim()) {
      const searchLowerCase = searchTermByName.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name?.first?.toLowerCase().includes(searchLowerCase) ||
        user.name?.last?.toLowerCase().includes(searchLowerCase)
      );
    }

    // Исключение определенных ключей
    const sanitizedUsers = filteredUsers.map(user => {
      return Object.keys(user).reduce((acc, key) => {
        if (!excludeKeys.includes(key)) {
          // @ts-ignore
          acc[key] = user[key];
        }
        return acc;
      }, {} as any);
    });

    // Сортировка по возрасту
    sanitizedUsers.sort((a, b) => {
      const ageA = a.age || 0; // Обработка случая, если `age` отсутствует
      const ageB = b.age || 0;
      if (sortOrder === 'asc') {
        return ageA - ageB;
      } else {
        return ageB - ageA;
      }
    });

    // Пагинация
    const paginatedUsers = sanitizedUsers.slice(offset, offset + limit);

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
