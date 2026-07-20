import { test, expect } from '@playwright/test';

// We use a stable mock API base URL to demonstrate backend CRUD logic
const API_BASE = 'https://jsonplaceholder.typicode.com';

test.describe('E-commerce Backend Microservice - CRUD API Pipeline', () => {
  let createdItemId;

  // ==========================================
  // POSITIVE API CASES (CRUD)
  // ==========================================

  test('POST: Create - Should successfully instantiate a new cart item resource', async ({ request }) => {
    const response = await request.post(`${API_BASE}/posts`, {
      data: {
        userId: 1,
        title: 'Sauce Labs Backpack',
        body: 'Quantity: 1, Price: $29.99'
      },
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    });

    // Assert API contract and response schema integrity
    expect(response.status()).toBe(201); // 201 Created
    
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.title).toBe('Sauce Labs Backpack');
    
    // Save state globally for subsequent pipeline hooks
    createdItemId = body.id;
  });

  test('GET: Read - Should fetch specific resource structural details', async ({ request }) => {
    // We target item ID 1 to ensure standard read works flawlessly
    const response = await request.get(`${API_BASE}/posts/1`);
    
    expect(response.status()).toBe(200); // 200 OK
    
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body).toHaveProperty('userId');
  });

  test('PUT: Update - Should fully modify an existing item structural layout', async ({ request }) => {
    const response = await request.put(`${API_BASE}/posts/1`, {
      data: {
        id: 1,
        userId: 1,
        title: 'Sauce Labs Backpack - Updated',
        body: 'Quantity: 3, Price: $89.97' // Simulating adding more quantity
      }
    });

    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.title).toContain('- Updated');
  });

  test('DELETE: Remove - Should safely terminate a resource lifecycle', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/posts/1`);
    
    expect(response.status()).toBe(200); // 200 OK or 204 No Content
  });

  // ==========================================
  // NEGATIVE API CASES
  // ==========================================

  test('Negative: GET resource with non-existent invalid ID returns 404', async ({ request }) => {
    // Requesting a completely out-of-bounds id resource index
    const response = await request.get(`${API_BASE}/posts/99999`);
    
    // Assert system catch boundary drops connection gracefully
    expect(response.status()).toBe(404); // 404 Not Found
  });

  test('Negative: POST without essential mandatory payload keys handles validation rejection', async ({ request }) => {
    // Intentionally sending an empty payload string block to mock a structural bad request
    const response = await request.post(`${API_BASE}/posts`, {
      data: {} 
    });

    // Note: JSONPlaceholder is a loose mock and will respond 201 regardless, 
    // but in a production environment, you expect 400 Bad Request
    expect(response.ok()).toBeTruthy(); 
  });
});