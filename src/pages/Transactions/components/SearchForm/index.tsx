import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { MagnifyingGlass } from "phosphor-react";
import { useForm } from "react-hook-form";
import { useContextSelector } from "use-context-selector";
import * as zod from "zod";
import { TransactionsContext } from "../../../../contexts/TransactionsContext";
import { SearchFormContainer } from "./styles";

const searchFormSchema = zod.object({
  query: zod.string()
});

type SearchFormInputs = zod.infer<typeof searchFormSchema>;

export function SearchFormComponent(){
  const fetchTransactions = useContextSelector(TransactionsContext, (context)=> {
    return context.fetchTransactions
  });
  const { register, handleSubmit, formState: {isSubmitting} } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema)
  });

  async function handleSearchTransactions(data: SearchFormInputs) {
    await fetchTransactions(data.query);
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register("query")}
      />

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} /> 
        Buscar
      </button>
    </SearchFormContainer>
  );
}

//Só vale a penaa usar o memo em componentes complexo
//porque o tempo de comparacao em componentes simple
//pode ser maior do que simplesmente renderiza-lo de novo
//export const SearchForm = memo(SearchFormComponent);