export function hasExpired(createdAt: Date, sec: number) {
    return createdAt.getTime() + sec * 1000 < new Date().getTime();
}