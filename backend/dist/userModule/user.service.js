"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async signUp(email, name, password) {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, name, password: hashedPassword });
        const userResponse = await this.userRepository.save(user);
        const payload = { email: userResponse.email, sub: userResponse._id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        userResponse.refreshToken = refreshToken;
        await this.userRepository.save(userResponse);
        return {
            _id: userResponse._id,
            email: userResponse.email,
            name: userResponse.name,
            accessToken,
            refreshToken,
        };
    }
    async signIn(email, password) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.error('Invalid password');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { email: user.email, sub: user._id };
            const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
            user.refreshToken = refreshToken;
            await this.userRepository.save(user);
            return {
                _id: user._id,
                email: user.email,
                name: user.name,
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            console.error('Error during signIn: ', error.message || error);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException('An error occurred during sign-in');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.userRepository.findOne({ where: { email: decoded.email } });
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const payload = { email: user.email, sub: user._id };
            const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
            return { accessToken: newAccessToken };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map