// Блог перевизначає openGraph у власних generateMetadata, що затирає картинку,
// успадковану від сегмента [locale]. Тому та сама картинка оголошується тут ще раз.
export { default, size, contentType, alt } from '../opengraph-image'
