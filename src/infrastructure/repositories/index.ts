import {
  LocalStorageProfileRepository,
  type ProfileRepository,
} from "./profile-repository";

let _repository: ProfileRepository | null = null;

export function getProfileRepository(): ProfileRepository {
  if (!_repository) {
    _repository = new LocalStorageProfileRepository();
  }
  return _repository;
}

export function __setProfileRepositoryForTesting(repo: ProfileRepository) {
  _repository = repo;
}

export type { ProfileRepository } from "./profile-repository";
