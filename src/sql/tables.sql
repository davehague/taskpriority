--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 16.2

-- Started on 2024-04-17 14:52:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 289 (class 1259 OID 29817)
-- Name: tasks; Type: TABLE; Schema: taskpriority; Owner: postgres
--

CREATE TABLE taskpriority.tasks (
    id integer NOT NULL,
    owner_id uuid,
    task_name text,
    is_active boolean
);


ALTER TABLE taskpriority.tasks OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 29816)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: taskpriority; Owner: postgres
--

CREATE SEQUENCE taskpriority.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE taskpriority.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 3779 (class 0 OID 0)
-- Dependencies: 288
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: taskpriority; Owner: postgres
--

ALTER SEQUENCE taskpriority.tasks_id_seq OWNED BY taskpriority.tasks.id;


--
-- TOC entry 290 (class 1259 OID 29880)
-- Name: versus; Type: TABLE; Schema: taskpriority; Owner: postgres
--

CREATE TABLE taskpriority.versus (
    task_id_1 integer NOT NULL,
    task_id_2 integer NOT NULL,
    preference taskpriority.preference_type
);


ALTER TABLE taskpriority.versus OWNER TO postgres;

--
-- TOC entry 3615 (class 2604 OID 29820)
-- Name: tasks id; Type: DEFAULT; Schema: taskpriority; Owner: postgres
--

ALTER TABLE ONLY taskpriority.tasks ALTER COLUMN id SET DEFAULT nextval('taskpriority.tasks_id_seq'::regclass);


--
-- TOC entry 3617 (class 2606 OID 29824)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: taskpriority; Owner: postgres
--

ALTER TABLE ONLY taskpriority.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 3619 (class 2606 OID 30448)
-- Name: versus versus_pkey; Type: CONSTRAINT; Schema: taskpriority; Owner: postgres
--

ALTER TABLE ONLY taskpriority.versus
    ADD CONSTRAINT versus_pkey PRIMARY KEY (task_id_1, task_id_2);


--
-- TOC entry 3620 (class 2606 OID 29825)
-- Name: tasks tasks_owner_id_fkey; Type: FK CONSTRAINT; Schema: taskpriority; Owner: postgres
--

ALTER TABLE ONLY taskpriority.tasks
    ADD CONSTRAINT tasks_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id);


--
-- TOC entry 3621 (class 2606 OID 29886)
-- Name: versus versus_task_id_1_fkey; Type: FK CONSTRAINT; Schema: taskpriority; Owner: postgres
--

ALTER TABLE ONLY taskpriority.versus
    ADD CONSTRAINT versus_task_id_1_fkey FOREIGN KEY (task_id_1) REFERENCES taskpriority.tasks(id);


--
-- TOC entry 3622 (class 2606 OID 29891)
-- Name: versus versus_task_id_2_fkey; Type: FK CONSTRAINT; Schema: taskpriority; Owner: postgres
--

ALTER TABLE ONLY taskpriority.versus
    ADD CONSTRAINT versus_task_id_2_fkey FOREIGN KEY (task_id_2) REFERENCES taskpriority.tasks(id);


--
-- TOC entry 3778 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE tasks; Type: ACL; Schema: taskpriority; Owner: postgres
--

GRANT ALL ON TABLE taskpriority.tasks TO anon;
GRANT ALL ON TABLE taskpriority.tasks TO authenticated;
GRANT ALL ON TABLE taskpriority.tasks TO service_role;


--
-- TOC entry 3780 (class 0 OID 0)
-- Dependencies: 288
-- Name: SEQUENCE tasks_id_seq; Type: ACL; Schema: taskpriority; Owner: postgres
--

GRANT ALL ON SEQUENCE taskpriority.tasks_id_seq TO anon;
GRANT ALL ON SEQUENCE taskpriority.tasks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE taskpriority.tasks_id_seq TO service_role;


--
-- TOC entry 3781 (class 0 OID 0)
-- Dependencies: 290
-- Name: TABLE versus; Type: ACL; Schema: taskpriority; Owner: postgres
--

GRANT ALL ON TABLE taskpriority.versus TO anon;
GRANT ALL ON TABLE taskpriority.versus TO authenticated;
GRANT ALL ON TABLE taskpriority.versus TO service_role;


-- Completed on 2024-04-17 14:52:48

--
-- PostgreSQL database dump complete
--

