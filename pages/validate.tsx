import { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '@components/input';
import usePost from '@libs/client/hooks/usePost';
import CarrotResponse from '@libs/server/carrotResponse';

type FormFields = {
    token: string;
};
// TODO: enter 페이지에서 validate 페이지를 분리하면서 문제 발생. 다시 복귀해야함. 컴포넌트화 시킬 것.
const Validate: NextPage = () => {
    const { register, handleSubmit } = useForm<FormFields>();
    const [validateToken, result] = usePost<FormFields, CarrotResponse>(
        '/api/users/validate',
    );

    const onValid: SubmitHandler<FormFields> = (data) => {
        validateToken(data);
    };

    return (
        <div className="mt-16 px-4">
            <h3 className="text-3xl font-bold text-center">
                Checking validation code..
            </h3>
            <div className="mt-12">
                <div className="flex flex-col items-center">
                    <form onSubmit={handleSubmit(onValid)}>
                        <Input
                            label={'Your received token'}
                            register={register('token')}
                            name={'token'}
                            kind={'text'}
                            type={'text'}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Validate;
