import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVitalSignInput } from './dto/create-vitalSigns.input';
import { UpdateVitalSignInput } from './dto/update-vitalSigns.input';
import { VitalSigns } from './entities/vitalSigns.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Brackets, Repository } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class VitalSignsService {
  constructor(
    @InjectRepository(VitalSigns)
    private vitalSignsRepository: Repository<VitalSigns>,

    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private idService: IdService, // Inject the IdService
  ) { }
  async createVitalSign(patientUuid: string, vitalSignData: CreateVitalSignInput): Promise<VitalSigns> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ["id"],
      where: { uuid: patientUuid }
    });
    const newVitalSign = new VitalSigns();
    const uuidPrefix = 'VTL-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newVitalSign.uuid = uuid;
    newVitalSign.patientId = patientId;
    Object.assign(newVitalSign, vitalSignData);
    this.vitalSignsRepository.save(newVitalSign);
    const savedVitalSign = await this.vitalSignsRepository.save(newVitalSign);
    const result = { ...savedVitalSign };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return (result)
  }
  //PAGED vitalSign list PER PATIENT
  async getAllVitalSignsByPatient(patientUuid: string, term: string,
    page: number = 1, sortBy: string = 'lastName', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: VitalSigns[], totalPages: number, currentPage: number, totalCount }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    const patientExists = await this.patientsRepository.findOne({ where: { uuid: patientUuid } });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const vitalSignsQueryBuilder = this.vitalSignsRepository
      .createQueryBuilder('vitalsign')
      .innerJoinAndSelect('vitalsign.patient', 'patient')
      .select([
        'vitalsign.uuid',
        'vitalsign.date',
        'vitalsign.time',
        'vitalsign.bloodPressure',
        'vitalsign.heartRate',
        'vitalsign.temperature',
        'vitalsign.respiratoryRate',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`vitalsign.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== "") {
      console.log("term", term);
      vitalSignsQueryBuilder
        .where(new Brackets((qb) => {
          qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid })
        }))
        .andWhere(new Brackets((qb) => {
          qb.andWhere("vitalsign.uuid ILIKE :searchTerm", { searchTerm })
            .orWhere("vitalsign.date ILIKE :searchTerm", { searchTerm })
        }));
    }
    const vitalSignsResultList = await vitalSignsQueryBuilder.getRawMany();
    const totalPatientVitalSign = await vitalSignsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientVitalSign / perPage);
    return {
      data: vitalSignsResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientVitalSign,
    };
  }
  async updateVitalSign(id: string,
    updateVitalSignInput: UpdateVitalSignInput,
  ): Promise<VitalSigns> {
    const { ...updateData } = updateVitalSignInput;
    const prescriptions = await this.vitalSignsRepository.findOne({ where: { uuid: id } });
    if (!prescriptions) {
      throw new NotFoundException(`VitalSign  ID-${id}  not found.`);
    }
    Object.assign(prescriptions, updateData);
    return this.vitalSignsRepository.save(prescriptions);
  }
  async softDeleteVitalSign(id: string): Promise<{ message: string, deletedVitalSign: VitalSigns }> {
    const prescriptions = await this.vitalSignsRepository.findOne({ where: { uuid: id } });
    if (!prescriptions) {
      throw new NotFoundException(`Prescriptions ID-${id} does not exist.`);
    }
    prescriptions.deletedAt = new Date().toISOString();
    const deletedVitalSign = await this.vitalSignsRepository.save(prescriptions);
    return { message: `Prescriptions with ID ${id} has been soft-deleted.`, deletedVitalSign };

  }
}
