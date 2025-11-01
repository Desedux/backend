import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Backend' })
  name: string;

  @ApiProperty({ example: 'Assuntos sobre desenvolvimento backend', nullable: true })
  description: string | null;

  @ApiProperty({
    example: 'https://cdn.exemplo.com/tags/backend.png',
    nullable: true,
  })
  image_url: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-10-31T12:34:56.000Z',
  })
  created_at: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-10-31T12:34:56.000Z',
  })
  updated_at: string;
}
